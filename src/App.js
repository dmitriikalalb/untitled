import React from 'react';
import './App.css';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import { withStyles } from '@material-ui/core/styles';
import {
    Scheduler,
    Resources,
    WeekView,
    Toolbar,
    DateNavigator,
    Appointments,
    AppointmentForm,
    AppointmentTooltip,
    EditRecurrenceMenu,
    ConfirmationDialog,
    AllDayPanel,
} from '@devexpress/dx-react-scheduler-material-ui';
import { appointments, resourcesData } from './demo-data/appointments';

const allDayLocalizationMessages = {
    'ru-RU': {
        allDay: 'Несколько дней',
    },
    'en-US': {
        allDay: 'All Day',
    },
};

const getAllDayMessages = locale => allDayLocalizationMessages[locale];

const styles = theme => ({
    container: {
        display: 'flex',
        marginBottom: theme.spacing(2),
        justifyContent: 'flex-end',
    },
    text: {
        ...theme.typography.h6,
        marginRight: theme.spacing(2),
    },
});

const LocaleSwitcher = withStyles(styles, { name: 'LocaleSwitcher' })(
    ({ onLocaleChange, currentLocale, classes }) => (
        <div className={classes.container}>
            <div className={classes.text}>
                Locale:
            </div>
            <TextField
                select
                value={currentLocale}
                onChange={onLocaleChange}
            >
                <MenuItem value="ru-RU">Русский (Россия)</MenuItem>
                <MenuItem value="en-US">English (United States)</MenuItem>
            </TextField>
        </div>
    ),
);

export default class Demo extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            data: appointments,
            currentDate: new Date().toString(),
            locale: 'ru-RU',

            addedAppointment: {},
            appointmentChanges: {},
            editingAppointmentId: undefined,

            resources: [
                {
                    fieldName: 'roomId',
                    title: 'Состояние задачи',
                    instances: resourcesData,
                },
            ],
        };

        this.commitChanges = this.commitChanges.bind(this);
        this.changeAddedAppointment = this.changeAddedAppointment.bind(this);
        this.changeAppointmentChanges = this.changeAppointmentChanges.bind(this);
        this.changeEditingAppointmentId = this.changeEditingAppointmentId.bind(this);

        this.changeLocale = event => this.setState({ locale: event.target.value });
    }

    changeAddedAppointment(addedAppointment) {
        this.setState({ addedAppointment });
    }

    changeAppointmentChanges(appointmentChanges) {
        this.setState({ appointmentChanges });
    }

    changeEditingAppointmentId(editingAppointmentId) {
        this.setState({ editingAppointmentId });
    }

    commitChanges({ added, changed, deleted }) {
        this.setState((state) => {
            let { data } = state;
            if (added) {
                const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
                data = [...data, { id: startingAddedId, ...added }];
            }
            if (changed) {
                data = data.map(appointment => (
                    changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
            }
            if (deleted !== undefined) {
                data = data.filter(appointment => appointment.id !== deleted);
            }
            return { data };
        });
    }

    render() {
        const { data, currentDate, locale, addedAppointment, appointmentChanges, editingAppointmentId, resources } = this.state;

        return (
            <div>
                <LocaleSwitcher
                    currentLocale={locale}
                    onLocaleChange={this.changeLocale}
                />
                <Paper>
                    <Scheduler
                        data={data}
                        locale={locale}
                        height={660}
                    >
                        <ViewState
                            defaultCurrentDate={currentDate}
                        />
                        <EditingState
                            onCommitChanges={this.commitChanges}

                            addedAppointment={addedAppointment}
                            onAddedAppointmentChange={this.changeAddedAppointment}

                            appointmentChanges={appointmentChanges}
                            onAppointmentChangesChange={this.changeAppointmentChanges}

                            editingAppointmentId={editingAppointmentId}
                            onEditingAppointmentIdChange={this.changeEditingAppointmentId}
                        />
                        <EditRecurrenceMenu />
                        <WeekView
                            startDayHour={5.5}
                            endDayHour={22.5}
                        />
                        <Toolbar />
                        <DateNavigator />
                        <ConfirmationDialog />
                        <Appointments />
                        <AppointmentTooltip
                            showCloseButton
                            showOpenButton
                            showDeleteButton
                        />
                        <AppointmentForm />
                        <Resources
                            data={resources}
                            mainResourceName="roomId"
                        />
                        <AllDayPanel
                            messages={getAllDayMessages(locale)}
                        />
                    </Scheduler>
                </Paper>
            </div>
        );
    }
}